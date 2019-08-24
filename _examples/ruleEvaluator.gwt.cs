using System;
using System.Collections.Generic;
using System.Reflection;
using MyMonolith.Contracts.Merchandising.Models.Interfaces;
using MyMonolith.Contracts.OptionAndRulesManagement.Queries.Interfaces;
using MyMonolith.Domain.Merchandising.Matrix;
using MyMonolith.Domain.Merchandising.Matrix.Scenarios;
using MyMonolith.Services.Merchandising.Matrix;
using FluentAssertions;
using NUnit.Framework;
using MyMonolith.Domain.OptionAndRulesManagement.Entities.Rules;
using ProductSetup.Domain.ProductSelection.Entities;
using Rhino.Mocks;
using Veyron.Tests;
using Product = MyMonolith.Domain.Ordering.ValueObjects.Product;
using Site = MyMonolith.Domain.Ordering.ValueObjects.Site;
using SiteProduct = MyMonolith.Domain.Ordering.ValueObjects.SiteProduct;
using SiteProductVersion = MyMonolith.Domain.Ordering.ValueObjects.SiteProductVersion;

namespace MyMonolith.Tests.Unit.Merchandising.Services
{
    [TestFixture]
    class TestScenarioRuleEvaluator : InMemoryDatabaseWithRavenDbTest
    {
        [SetUp]
        public void Setup()
        {
            given_rule_type_query();
            given_executor();
            given_product_type_builder();
            given_scenario_to_match_rule();
            given_scenario_to_match();
            given_test_product();
            given_evaluator();
            given_this_price_context(_testProduct.GetPricingContext());            
        }

        [Test]
        public void no_scenario_matches()
        {
            when_matching_with_these(new Scenario[] { });

            _matching.Should().Be(null);
        }

        [Test]
        public void finds_single_scenario_based_on_Selection()
        {
            given_these_scenarios(new[] { _scenarioToMatch });
            given_executor_expected_to_return_true_once();

            when_matching_with_these(_scenarios);

            _matching.Should().Be(_scenarioToMatch);
        }

        [Test]
        public void finds_first_scenario_that_evaluator_likes()
        {
            given_scenario_to_reject();
            given_these_scenarios(new[] { _scenarioToReject, _scenarioToMatch });
            given_executor_expected_to_return_true_and_false_once();

            when_matching_with_these(_scenarios);

            _matching.Should().Be(_scenarioToMatch);
            _matching.Should().NotBe(_scenarioToReject);
        }

        [Test]
        public void evaluator_picks_default_scenario_when_no_scenarios_match()
        {
            given_scnario_to_match_is_the_default_one();
            given_scenario_to_reject();
            given_these_scenarios(new[] { _scenarioToReject, _scenarioToMatch });
            given_executor_expected_to_return_true_and_false_once();

            when_matching_with_these(_scenarios);

            _matching.Should().Be(_scenarioToMatch);
            _matching.Should().NotBe(_scenarioToReject);
        }

        [Test]
        public void finds_first_scenario_honoring_zip_code_group_when_both_scenarios_have_zip_code_groups()
        {
            given_pricing_context_includes_a_zip_code();
            given_zip_code_group_with_zip_codes(new[] { "12345" });
            given_another_zip_code_group_with_zip_codes(new[] { "99999" });
            given_scenario_to_reject();
            given_scenario_to_reject_does_NOT_include_zip_code_group_containing_zip_code_in_pricing_context();
            given_scenario_to_match_DOES_include_zip_code_group_containing_zip_code_in_pricing_context();
            given_executor_expected_to_return_true_once();

            when_matching_with_these(new[] { _scenarioToReject, _scenarioToMatch });

            _matching.Should().Be(_scenarioToMatch);
            _matching.Should().NotBe(_scenarioToReject);
        }

        [Test]
        public void finds_first_scenario_matching_rule_even_if_there_are_other_scenarios_with_matching_zip_code_groups()
        {
            given_pricing_context_includes_a_zip_code();
            given_zip_code_group_with_zip_codes(new[] { "12345" });
            given_scenario_to_reject();
            given_scenario_to_reject_DOES_include_zip_code_group_containing_zip_code_in_pricing_context();
            given_scenario_to_match_does_not_include_any_zip_code_group();
            given_executor_expected_to_return_true_once();

            when_matching_with_these(new[] { _scenarioToMatch, _scenarioToReject });

            _matching.Should().Be(_scenarioToMatch);
            _matching.Should().NotBe(_scenarioToReject);
        }

        IScenarioRuleExecutor _executor;
        IProductTypeBuilder _builder;
        IRuleTypeQuery _query;
        IRuleModel _scenarioToMatchRule;
        MyMonolith.Domain.Selections.Entities.Selection _testProduct;
        ScenarioRuleEvaluator _evaluator;
        Scenario _scenarioToMatch;
        List<Scenario> _scenarios;
        Scenario _matching;
        Scenario _scenarioToReject;
        PricingContext _pricingContext;
        ZipCodeGroup _zipCodeGroup;
        ZipCodeGroup _anotherZipCodeGroup;

        void given_scenario_to_match_does_not_include_any_zip_code_group()
        {
            _scenarioToMatch.ZipCodeGroupIds.Clear();
        }

        void given_scenario_to_reject_DOES_include_zip_code_group_containing_zip_code_in_pricing_context()
        {
            _scenarioToReject.ZipCodeGroupIds.Add(_zipCodeGroup.Id);
        }

        void given_scenario_to_match_DOES_include_zip_code_group_containing_zip_code_in_pricing_context()
        {
            _scenarioToMatch.ZipCodeGroupIds.Add(_zipCodeGroup.Id);
        }

        void given_scenario_to_reject_does_NOT_include_zip_code_group_containing_zip_code_in_pricing_context()
        {
            _scenarioToReject.ZipCodeGroupIds.Add(_anotherZipCodeGroup.Id);
        }

        void given_zip_code_group_with_zip_codes(string[] zipCodes)
        {
            _zipCodeGroup = new ZipCodeGroup("Group 1", true);
            _zipCodeGroup.AddZipCodes(zipCodes);

            using (var tx = session.BeginTransaction())
            {
                session.Save(_zipCodeGroup);

                tx.Commit();
            }
        }

        void given_another_zip_code_group_with_zip_codes(string[] zipCodes)
        {
            _anotherZipCodeGroup = new ZipCodeGroup("Group 1", true);
            _anotherZipCodeGroup.AddZipCodes(zipCodes);

            using (var tx = session.BeginTransaction())
            {
                session.Save(_anotherZipCodeGroup);

                tx.Commit();
            }
        }

        void given_pricing_context_includes_a_zip_code()
        {
            _pricingContext = _testProduct.GetPricingContext(zipCode: "12345");
        }

        void given_evaluator()
        {
            _evaluator = new ScenarioRuleEvaluator(_query, _executor, _builder, null, session);
        }

        void given_test_product()
        {
            _testProduct = new MyMonolith.Domain.Selections.Entities.Selection()
            {
                SiteProductVersion = new SiteProductVersion(1, 1, 1)
                {
                    SiteProduct = new SiteProduct(
                        new Site(1, "Site"), new Product(1))
                }
            };
        }

        void given_scenario_to_match()
        {
            _scenarioToMatch = new Scenario("Pick Me");
            _scenarioToMatch.SetRule(_scenarioToMatchRule.GetRuleXml());
        }

        void given_scenario_to_match_rule()
        {
            _scenarioToMatchRule = MockRepository.GenerateStub<IRuleModel>();
            _scenarioToMatchRule.Stub(x => x.GetRuleXml()).Return("Pick Me");
        }

        void given_product_type_builder()
        {
            _builder = MockRepository.GenerateStub<IProductTypeBuilder>();
            _builder.Stub(b => b.Build(Arg<Type>.Is.Anything, Arg<ConfiguredProduct>.Is.Anything)).Return(new object());
        }

        void given_executor()
        {
            _executor = MockRepository.GenerateStub<IScenarioRuleExecutor>();
        }

        void given_rule_type_query()
        {
            _query = MockRepository.GenerateStub<IRuleTypeQuery>();
            _query.Stub(q => q.Get(Arg<int>.Is.Anything)).Return(new TypeDelegator(typeof(ConfiguredProduct)));
        }

        void given_scnario_to_match_is_the_default_one()
        {
            _scenarioToMatch.IsDefault = true;
        }

        void given_executor_expected_to_return_true_and_false_once()
        {
            _executor.Expect(x => x.Matches(Arg<Type>.Is.Anything, Arg<object>.Is.Anything, Arg<string>.Is.Anything))
                .Return(false).Repeat.Once();
            _executor.Expect(x => x.Matches(Arg<Type>.Is.Anything, Arg<object>.Is.Anything, Arg<string>.Is.Anything))
                .Return(true).Repeat.Once();
        }

        void given_executor_expected_to_return_true_once()
        {
            _executor.Stub(x => x.Matches(Arg<Type>.Is.Anything, Arg<object>.Is.Anything, Arg<string>.Is.Anything))
                .Return(true);
        }

        void given_these_scenarios(IEnumerable<Scenario> scenarios)
        {
            _scenarios = new List<Scenario>(scenarios);
        }

        void given_scenario_to_reject()
        {
            _scenarioToReject = new Scenario("Do not pick me");
            var scenarioToRejectRule = MockRepository.GenerateStub<IRuleModel>();
            scenarioToRejectRule.Stub(x => x.GetRuleXml()).Return("Pick Me");
            _scenarioToReject.SetRule(scenarioToRejectRule.GetRuleXml());
        }

        void given_this_price_context(PricingContext pricingContext)
        {
            _pricingContext = pricingContext;
        }

        void when_matching_with_these(IEnumerable<Scenario> scenarios)
        {
            _matching = _evaluator.MatchingScenarioFrom(_pricingContext, scenarios);
        }
    }
}
