using System;
using System.Collections.Generic;
using System.Reflection;
using Autobahn.Contracts.Merchandising.Models.Interfaces;
using Autobahn.Contracts.Merchandising.Queries.Matrix.Scenarios.Interfaces;
using Autobahn.Contracts.OptionAndRulesManagement.Queries.Interfaces;
using Autobahn.Domain.Merchandising.Matrix;
using Autobahn.Domain.Merchandising.Matrix.Scenarios;
using Autobahn.Domain.Ordering.ValueObjects;
using Autobahn.Services.Merchandising.Matrix;
using FluentAssertions;
using NUnit.Framework;
using Autobahn.Domain.OptionAndRulesManagement.Entities.Rules;
using Rhino.Mocks;
using Veyron.Tests;

namespace Autobahn.Tests.Unit.Merchandising.Services
{
  [TestFixture]
  class TestScenarioRuleEvaluatora : RavenDbTest
  {
    [Test]
    public void NoScenarioMatches()
    {
      var query = MockRepository.GenerateStub<IRuleTypeQuery>();
      query.Stub(q => q.Get(Arg<int>.Is.Anything)).Return(new TypeDelegator(typeof(ConfiguredProduct)));

      var executor = MockRepository.GenerateStub<IScenarioRuleExecutor>();
      var builder = MockRepository.GenerateStub<IProductTypeBuilder>();
      builder.Stub(b => b.Build(Arg<Type>.Is.Anything, Arg<ConfiguredProduct>.Is.Anything)).Return(new object());
      var scenariosQuery = MockRepository.GenerateStub<ISiteProductScenariosQuery>();
      var evaluator = new ScenarioRuleEvaluator(query, executor, builder, scenariosQuery);

      var testProduct = new Autobahn.Domain.Configurations.Entities.Configuration()
      {
        SiteProductVersion = new SiteProductVersion(1, 1, 1)
        {
          SiteProduct = new SiteProduct(
              new Site(1, "Site"), new Product(1))
        }
      };
      var matching = evaluator.MatchingScenarioFrom(testProduct.GetPricingContext(), new Scenario[] { });

      matching.Should().Be(null);
    }

    [Test]
    public void FindsSingleScenarioBasedOnConfiguration()
    {
      var scenarioToMatchRule = MockRepository.GenerateStub<IRuleModel>();
      scenarioToMatchRule.Stub(x => x.GetRuleXml()).Return("Pick Me");
      var scenarioToMatch = new Scenario("Pick Me");
      scenarioToMatch.SetRule(scenarioToMatchRule.GetRuleXml());
      var scenarios = new List<Scenario> { scenarioToMatch };
      var query = MockRepository.GenerateStub<IRuleTypeQuery>();
      var executor = MockRepository.GenerateStub<IScenarioRuleExecutor>();
      executor.Stub(x => x.Matches(Arg<Type>.Is.Anything, Arg<object>.Is.Anything, Arg<string>.Is.Anything)).Return(true);
      query.Stub(q => q.Get(Arg<int>.Is.Anything)).Return(new TypeDelegator(typeof(ConfiguredProduct)));
      var builder = MockRepository.GenerateStub<IProductTypeBuilder>();
      builder.Stub(b => b.Build(Arg<Type>.Is.Anything, Arg<ConfiguredProduct>.Is.Anything)).Return(new object());
      var evaluator = new ScenarioRuleEvaluator(query, executor, builder, null);
      var testProduct = new Autobahn.Domain.Configurations.Entities.Configuration()
      {
        SiteProductVersion = new SiteProductVersion(1, 1, 1)
        {
          SiteProduct = new SiteProduct(
              new Site(1, "Site"), new Product(1))
        }
      };
      var matching = evaluator.MatchingScenarioFrom(testProduct.GetPricingContext(), scenarios);

      matching.Should().Be(scenarioToMatch);
    }


    [Test]
    public void FindsFirstScenarioThatEvaluatorLikes()
    {
      var scenarioToMatch = new Scenario("Pick Me");
      var scenarioToMatchRule = MockRepository.GenerateStub<IRuleModel>();
      scenarioToMatchRule.Stub(x => x.GetRuleXml()).Return("Pick Me");
      scenarioToMatch.SetRule(scenarioToMatchRule.GetRuleXml());

      var scenarioToReject = new Scenario("Do not pick me");
      var scenarioToRejectRule = MockRepository.GenerateStub<IRuleModel>();
      scenarioToRejectRule.Stub(x => x.GetRuleXml()).Return("Pick Me");
      scenarioToReject.SetRule(scenarioToRejectRule.GetRuleXml());
      var scenarios = new List<Scenario>();
      scenarios.Add(scenarioToReject);
      scenarios.Add(scenarioToMatch);

      var query = MockRepository.GenerateStub<IRuleTypeQuery>();
      var executor = MockRepository.GenerateStub<IScenarioRuleExecutor>();
      executor.Expect(x => x.Matches(Arg<Type>.Is.Anything, Arg<object>.Is.Anything, Arg<string>.Is.Anything)).Return(false).Repeat.Once();
      executor.Expect(x => x.Matches(Arg<Type>.Is.Anything, Arg<object>.Is.Anything, Arg<string>.Is.Anything)).Return(true).Repeat.Once();
      query.Stub(q => q.Get(Arg<int>.Is.Anything)).Return(new TypeDelegator(typeof(ConfiguredProduct)));
      var builder = MockRepository.GenerateStub<IProductTypeBuilder>();
      builder.Stub(b => b.Build(Arg<Type>.Is.Anything, Arg<ConfiguredProduct>.Is.Anything)).Return(new object());
      var evaluator = new ScenarioRuleEvaluator(query, executor, builder, null);
      var testProduct = new Autobahn.Domain.Configurations.Entities.Configuration()
      {
        SiteProductVersion = new SiteProductVersion(1, 1, 1)
        {
          SiteProduct = new SiteProduct(
              new Site(1, "Site"), new Product(1))
        }
      };
      var matching = evaluator.MatchingScenarioFrom(testProduct.GetPricingContext(), scenarios);

      matching.Should().Be(scenarioToMatch);
      matching.Should().NotBe(scenarioToReject);
    }

    [Test]
    public void EvaluatorPicksDefaultScenarioWhenNoScenariosMatch()
    {
      var scenarioToMatch = new Scenario("Pick Me");
      scenarioToMatch.IsDefault = true;
      var scenarioToMatchRule = MockRepository.GenerateStub<IRuleModel>();
      scenarioToMatchRule.Stub(x => x.GetRuleXml()).Return("Pick Me");
      scenarioToMatch.SetRule(scenarioToMatchRule.GetRuleXml());

      var scenarioToReject = new Scenario("Do not pick me");
      var scenarioToRejectRule = MockRepository.GenerateStub<IRuleModel>();
      scenarioToRejectRule.Stub(x => x.GetRuleXml()).Return("Pick Me");
      scenarioToReject.SetRule(scenarioToRejectRule.GetRuleXml());
      var scenarios = new List<Scenario>();
      scenarios.Add(scenarioToReject);
      scenarios.Add(scenarioToMatch);

      var query = MockRepository.GenerateStub<IRuleTypeQuery>();
      var executor = MockRepository.GenerateStub<IScenarioRuleExecutor>();
      executor.Expect(x => x.Matches(Arg<Type>.Is.Anything, Arg<object>.Is.Anything, Arg<string>.Is.Anything)).Return(false).Repeat.Once();
      executor.Expect(x => x.Matches(Arg<Type>.Is.Anything, Arg<object>.Is.Anything, Arg<string>.Is.Anything)).Return(true).Repeat.Once();
      query.Stub(q => q.Get(Arg<int>.Is.Anything)).Return(new TypeDelegator(typeof(ConfiguredProduct)));
      var builder = MockRepository.GenerateStub<IProductTypeBuilder>();
      builder.Stub(b => b.Build(Arg<Type>.Is.Anything, Arg<ConfiguredProduct>.Is.Anything)).Return(new object());
      var evaluator = new ScenarioRuleEvaluator(query, executor, builder, null);
      var testProduct = new Autobahn.Domain.Configurations.Entities.Configuration()
      {
        SiteProductVersion = new SiteProductVersion(1, 1, 1)
        {
          SiteProduct = new SiteProduct(
                  new Site(1, "Site"), new Product(1))
        }
      };
      var matching = evaluator.MatchingScenarioFrom(testProduct.GetPricingContext(), scenarios);

      matching.Should().Be(scenarioToMatch);
      matching.Should().NotBe(scenarioToReject);
    }
  }

}
