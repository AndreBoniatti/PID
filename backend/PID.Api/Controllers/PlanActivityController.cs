using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PID.Domain.Commands;
using PID.Domain.Entities;
using PID.Domain.Repositories;

namespace PID.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PlanActivityController() : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> PostPlanActivity(
        [FromBody] CreatePlanActivityCommand command,
        [FromServices] IPeriodRepository periodRepository,
        [FromServices] IPlanRepository planRepository,
        [FromServices] IPlanActivityRepository planActivityRepository
    )
    {
        Plan plan;

        if (command.PlanId == null)
        {
            var lastPeriod = await periodRepository.GetLastPeriodAsync();
            if (lastPeriod == null)
                return BadRequest("Não há períodos cadastrados");

            var planExists = planRepository.Exists(x =>
                x.UserId == new Guid("a643795a-2d36-494f-8bf4-028504529ebe") &&
                x.PeriodId == lastPeriod.Id
            );

            if (planExists)
                return BadRequest("Plano já existente no período");

            plan = new Plan(new Guid("a643795a-2d36-494f-8bf4-028504529ebe"), lastPeriod.Id);
            command.PlanId = plan.Id;

            planRepository.Add(plan);
            await planRepository.SaveChangesAsync();
        }
        else
        {
            var savedPlan = planRepository.Find(x => x.Id == command.PlanId).FirstOrDefault();
            if (savedPlan == null)
                return BadRequest("Plano não encontrado");

            if (savedPlan.UserId != new Guid("a643795a-2d36-494f-8bf4-028504529ebe"))
                return BadRequest("Plano inválido");

            plan = savedPlan;
        }

        var planActivity = new PlanActivity(
            plan.Id,
            command.ActivityTypeId,
            command.Description,
            command.WorkloadAllocation);

        planActivityRepository.Add(planActivity);
        await planActivityRepository.SaveChangesAsync();

        return Ok(new { PlanId = plan.Id });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> PutPlanActivity(
        [FromRoute] Guid id,
        [FromBody] UpdatePlanActivityCommand command,
        [FromServices] IPlanActivityRepository planActivityRepository
    )
    {
        var planActivity = planActivityRepository.Find(x => x.Id == id).FirstOrDefault();
        if (planActivity == null)
            return NotFound("Atividade não encontrada");

        if (planActivity.Plan?.UserId != new Guid("a643795a-2d36-494f-8bf4-028504529ebe"))
            return BadRequest("Atividade inválida");

        planActivity.Update(
            command.ActivityTypeId,
            command.Description,
            command.WorkloadAllocation
        );

        planActivityRepository.Update(planActivity);
        await planActivityRepository.SaveChangesAsync();

        return Ok();
    }
}