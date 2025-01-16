using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PID.Api.Extensions;
using PID.Domain.Commands;
using PID.Domain.Dtos;
using PID.Domain.Entities;
using PID.Domain.Enums;
using PID.Domain.Repositories;

namespace PID.Api.Controllers;

[Authorize(Policy = "AdminPolicy")]
[ApiController]
[Route("api/[controller]")]
public class PeriodController : MainController
{
    private readonly List<int> _semestersAllowed = new() { 1, 2 };

    [AllowAnonymous]
    [HttpGet]
    public IActionResult GetPeriods(
        [FromServices] IPeriodRepository periodRepository
    )
    {
        var periods = periodRepository
            .GetAll()
            .Select(x => new PeriodDto
            {
                Id = x.Id,
                Description = x.GetInfo()
            })
            .OrderByDescending(x => x.Description)
            .ToList();

        return Ok(periods);
    }

    [AllowAnonymous]
    [HttpGet("{id:guid}/ApprovedPlans")]
    public async Task<IActionResult> GetApprovedPeriodPlans(
        [FromServices] IPlanRepository planRepository,
        [FromRoute] Guid id,
        [FromQuery] int pageIndex = 0,
        [FromQuery] int pageSize = 5
    )
    {
        var periodPlans = await planRepository.GetPeriodPlansAsync(id, pageIndex, pageSize, null, EPlanSituation.APPROVED);
        return Ok(periodPlans);
    }

    [HttpGet("{id:guid}/Plans")]
    public async Task<IActionResult> GetPeriodPlans(
        [FromServices] IPlanRepository planRepository,
        [FromRoute] Guid id,
        [FromQuery] string? userName,
        [FromQuery] EPlanSituation? planSituation,
        [FromQuery] int pageIndex = 0,
        [FromQuery] int pageSize = 5
    )
    {
        var periodPlans = await planRepository.GetPeriodPlansAsync(id, pageIndex, pageSize, userName, planSituation);
        return Ok(periodPlans);
    }

    [HttpPost]
    public async Task<IActionResult> PostPeriod(
        [FromBody] CreatePeriodCommand command,
        [FromServices] IPeriodRepository periodRepository
    )
    {
        if (!_semestersAllowed.Contains(command.Semester))
            return BadRequest("Semestre inválido");

        var period = new Period(command.Year, command.Semester);

        periodRepository.Add(period);
        await periodRepository.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePeriod(
        [FromRoute] Guid id,
        [FromServices] IPeriodRepository periodRepository,
        [FromServices] IPlanRepository planRepository
    )
    {
        var period = periodRepository.Find(x => x.Id == id).FirstOrDefault();
        if (period == null)
            return NotFound("Período não encontrada");

        if (planRepository.Exists(x => x.PeriodId == id))
            return BadRequest("Período já tem planos vinculado");

        periodRepository.Remove(period);
        await periodRepository.SaveChangesAsync();

        return Ok();
    }
}
