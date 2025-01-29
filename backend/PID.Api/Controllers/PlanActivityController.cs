using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PID.Api.Extensions;
using PID.Domain.Commands;
using PID.Domain.Entities;
using PID.Domain.Enums;
using PID.Domain.Repositories;

namespace PID.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PlanActivityController : MainController
{
    [HttpPost]
    public async Task<IActionResult> PostPlanActivity(
        [FromBody] CreatePlanActivityCommand command,
        [FromServices] IPeriodRepository periodRepository,
        [FromServices] IPlanRepository planRepository,
        [FromServices] IPlanActivityRepository planActivityRepository
    )
    {
        var userType = GetUserType();
        if (userType == EUserType.ADMIN)
            return BadRequest("Administradores não podem criar planos");

        var userId = GetUserId();
        Plan plan;

        if (command.PlanId == null)
        {
            var lastPeriod = await periodRepository.GetLastPeriodAsync();
            if (lastPeriod == null)
                return BadRequest("Não há períodos cadastrados");

            var planExists = planRepository.Exists(x =>
                x.UserId == userId &&
                x.PeriodId == lastPeriod.Id
            );

            if (planExists)
                return BadRequest("Plano já existente no período");

            plan = new Plan(userId, lastPeriod.Id);
            command.PlanId = plan.Id;

            planRepository.Add(plan);
            await planRepository.SaveChangesAsync();
        }
        else
        {
            var savedPlan = planRepository.Find(x => x.Id == command.PlanId).FirstOrDefault();
            if (savedPlan == null)
                return BadRequest("Plano não encontrado");

            if (savedPlan.UserId != userId)
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

        if (planActivity.Plan?.UserId != GetUserId())
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

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePlanActivity(
        [FromRoute] Guid id,
        [FromServices] IPlanActivityRepository planActivityRepository
    )
    {
        var planActivity = planActivityRepository.Find(x => x.Id == id).FirstOrDefault();
        if (planActivity == null)
            return NotFound("Atividade não encontrada");

        if (planActivity.Plan?.UserId != GetUserId())
            return BadRequest("Atividade inválida");

        planActivityRepository.Remove(planActivity);
        await planActivityRepository.SaveChangesAsync();

        return Ok();
    }
}