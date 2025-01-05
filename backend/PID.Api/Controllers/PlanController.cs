using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PID.Api.Extensions;
using PID.Domain.Dtos;
using PID.Domain.Enums;
using PID.Domain.Repositories;

namespace PID.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PlanController : MainController
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

        var userPlans = await planRepository.GetUserPlansAsync(GetUserId());
        userPlans = userPlans.OrderByDescending(x => x.Period).ToList();

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
        var plan = await planRepository.GetPlanByIdAsync(GetUserId(), id);
        if (plan == null)
            return NotFound("Plano não encontrado");

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
            x.UserId == GetUserId() &&
            x.PeriodId == lastPeriod.Id
        );

        return Ok(planExists);
    }
}
