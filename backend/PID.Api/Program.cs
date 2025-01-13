using DinkToPdf;
using DinkToPdf.Contracts;
using PID.Api.Extensions;
using PID.Api.Reports;
using PID.Domain.Dtos;
using PID.Domain.Reports;
using PID.Domain.Repositories;
using PID.Infra.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCorsConfiguration();

builder.Services.AddPIDDbContext(builder.Configuration.GetConnectionString("Database") ?? "");

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));

builder.Services.AddTransient<IActivityTypeRepository, ActivityTypeRepository>();
builder.Services.AddTransient<IPeriodRepository, PeriodRepository>();
builder.Services.AddTransient<IPlanRepository, PlanRepository>();
builder.Services.AddTransient<IPlanActivityRepository, PlanActivityRepository>();
builder.Services.AddTransient<IUserRepository, UserRepository>();

builder.Services.AddTransient<IReport<PlanDto>, WorkloadAllocationReport>();

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
