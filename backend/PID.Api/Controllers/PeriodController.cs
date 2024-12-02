using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PID.Domain.Repositories;

namespace PID.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PeriodController() : ControllerBase
{
    [HttpGet]
    public IActionResult GetPeriods(
        [FromServices] IPeriodRepository periodRepository
    )
    {
        return Ok(periodRepository.GetAll());
    }
}
