using Microsoft.AspNetCore.Mvc;
using PID.Domain.Enums;

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

    protected EUserType GetUserType()
    {
        var type = User.FindFirst("type")?.Value;
        if (Enum.TryParse(type, out EUserType userType))
            return userType;

        throw new Exception("Não foi possível recuperar o Tipo do usuário");
    }
}
