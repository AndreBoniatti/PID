using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PID.Api.Extensions;
using PID.Domain.Dtos;
using PID.Domain.Enums;
using PID.Domain.Reports;
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

    [HttpGet("{id:guid}/WorkloadAllocationReport")]
    public async Task<IActionResult> GetWorkloadAllocationReport(
        [FromRoute] Guid id,
        [FromServices] IPlanRepository planRepository,
        [FromServices] IReport<PlanDto> report
    )
    {
        var plan = await planRepository.GetPlanByIdAsync(GetUserId(), id);
        if (plan == null)
            return NotFound("Plano não encontrado");

        var pdf = report.GetPdf(plan);
        return File(pdf, "application/pdf");
    }

    [HttpPut("{id:guid}/Submit")]
    public async Task<IActionResult> SubmitPlan(
        [FromRoute] Guid id,
        [FromServices] IPlanRepository planRepository
    )
    {
        var plan = planRepository
            .Find(x => x.UserId == GetUserId() && x.Id == id)
            .FirstOrDefault();

        if (plan == null)
            return NotFound("Plano não encontrado");

        if (plan.Situation != EPlanSituation.PENDING)
            return BadRequest("Situação inválida");

        plan.SetSituation(EPlanSituation.SENT);
        planRepository.Update(plan);
        await planRepository.SaveChangesAsync();

        return Ok();
    }

    [HttpPut("{id:guid}/CancelSubmission")]
    public async Task<IActionResult> CancelPlanSubmission(
        [FromRoute] Guid id,
        [FromServices] IPlanRepository planRepository
    )
    {
        var plan = planRepository
            .Find(x => x.UserId == GetUserId() && x.Id == id)
            .FirstOrDefault();

        if (plan == null)
            return NotFound("Plano não encontrado");

        if (plan.Situation != EPlanSituation.SENT)
            return BadRequest("Situação inválida");

        plan.SetSituation(EPlanSituation.PENDING);
        planRepository.Update(plan);
        await planRepository.SaveChangesAsync();

        return Ok();
    }
}