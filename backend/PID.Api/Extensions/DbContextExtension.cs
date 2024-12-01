using Microsoft.EntityFrameworkCore;
using PID.Infra.Context;

namespace PID.Api.Extensions;

public static class DbContextExtension
{
    public static IServiceCollection AddPIDDbContext(this IServiceCollection services, string dbConnection)
    => services.AddDbContext<PIDContext>(options =>
    {
        options.UseNpgsql(dbConnection);
        options.EnableSensitiveDataLogging();
        options.UseLazyLoadingProxies();
    });
}

