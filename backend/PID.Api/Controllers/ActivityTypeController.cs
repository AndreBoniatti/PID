using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PID.Api.Extensions;
using PID.Domain.Repositories;

namespace PID.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ActivityTypeController : MainController
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromServices] IActivityTypeRepository activityTypeRepository
    )
    {
        var activityTypes = await activityTypeRepository.GetAllTypesAsync();
        return Ok(activityTypes);
    }
}