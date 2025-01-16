using Microsoft.AspNetCore.Mvc;

namespace PID.Api.Extensions;

public abstract class MainController : ControllerBase
{
    protected bool CallerIsAuthenticated() => User?.Identity?.IsAuthenticated ?? false;

    protected Guid GetUserId()
    {
        var id = User.FindFirst("id")?.Value;
        if (Guid.TryParse(id, out var userId))
            return userId;

        throw new Exception("Não foi possível recuperar o ID do usuário");
    }
}
