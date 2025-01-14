using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PID.Api.Extensions;
using PID.Domain.Dtos;
using PID.Domain.Repositories;

namespace PID.Api.Controllers;

[Authorize(Policy = "AdminPolicy")]
[ApiController]
[Route("api/[controller]")]
public class PeriodController : MainController
{
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
}
