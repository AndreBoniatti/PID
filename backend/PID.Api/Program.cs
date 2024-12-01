using PID.Api.Extensions;
using PID.Domain.Repositories;
using PID.Infra.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCorsConfiguration();

builder.Services.AddPIDDbContext(builder.Configuration.GetConnectionString("Database") ?? "");

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<IUserRepository, UserRepository>();

builder.Services.AddAuthConfiguration();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCorsConfiguration();

app.UseHttpsRedirection();

app.UseAuthConfiguration();
app.UseAuthorization();

app.MapControllers();

app.Run();
