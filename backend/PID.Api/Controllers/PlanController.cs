using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PID.Domain.Dtos;
using PID.Domain.Enums;
using PID.Domain.Repositories;

namespace PID.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PlanController() : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetPlans(
        [FromServices] IPlanRepository planRepository,
        [FromServices] IPeriodRepository periodRepository
    )
    {
        var lastPeriod = await periodRepository.GetLastPeriodAsync();
        if (lastPeriod == null)
            return BadRequest("Não há períodos cadastrados");

        var userPlans = await planRepository
            .GetUserPlansAsync(new Guid("a643795a-2d36-494f-8bf4-028504529ebe"));

        if (!userPlans.Any(x => x.Period == lastPeriod.GetInfo()))
        {
            userPlans.Insert(0, new PlansDto
            {
                Id = null,
                Situation = EPlanSituation.PENDING,
                Period = lastPeriod.GetInfo()
            });
        }

        return Ok(userPlans);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetPlanById(
        [FromRoute] Guid id,
        [FromServices] IPlanRepository planRepository
    )
    {
        var plan = await planRepository.GetPlanByIdAsync(new Guid("a643795a-2d36-494f-8bf4-028504529ebe"), id);
        return Ok(plan);
    }

    [HttpGet("HasPlanInLastPeriod")]
    public async Task<IActionResult> GetHasPlanInLastPeriod(
        [FromServices] IPlanRepository planRepository,
        [FromServices] IPeriodRepository periodRepository
    )
    {
        var lastPeriod = await periodRepository.GetLastPeriodAsync();
        if (lastPeriod == null)
            return BadRequest("Não há períodos cadastrados");

        var planExists = planRepository.Exists(x =>
            x.UserId == new Guid("a643795a-2d36-494f-8bf4-028504529ebe") &&
            x.PeriodId == lastPeriod.Id
        );

        return Ok(planExists);
    }
}
