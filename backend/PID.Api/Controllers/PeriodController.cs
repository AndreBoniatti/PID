using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace PID.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PeriodController() : ControllerBase
{
}
