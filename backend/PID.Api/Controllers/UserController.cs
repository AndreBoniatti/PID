using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PID.Api.Extensions;
using PID.Domain.Repositories;

namespace PID.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserController : MainController
{
    [HttpGet("Workload")]
    public IActionResult GetUserWorkload(
        [FromServices] IUserRepository userRepository
    )
    {
        var user = userRepository.Find(x => x.Id == GetUserId()).FirstOrDefault();
        if (user == null)
            return NotFound("Usuário não encontrado");

        return Ok(user.Workload);
    }
}
