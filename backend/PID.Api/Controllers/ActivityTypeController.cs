using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PID.Api.Extensions;
using PID.Domain.Dtos;
using PID.Domain.Repositories;

namespace PID.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ActivityTypeController : MainController
{
    [HttpGet]
    public IActionResult GetAll(
        [FromServices] IActivityTypeRepository activityTypeRepository
    )
    {
        var activityTypes = activityTypeRepository.GetAll()
            .Select(x => new ActivityTypeDto
            {
                Id = x.Id,
                Description = x.Description
            })
            .ToList();

        return Ok(activityTypes);
    }
}