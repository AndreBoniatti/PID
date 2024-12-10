using Microsoft.EntityFrameworkCore;
using PID.Domain.Entities;

namespace PID.Infra.Context;

public class PIDContext : DbContext
{
    public DbSet<Period> Periods => Set<Period>();
    public DbSet<Plan> Plans => Set<Plan>();
    public DbSet<User> Users => Set<User>();

    public PIDContext(DbContextOptions<PIDContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Period>()
            .HasIndex(p => new { p.Year, p.Semester })
            .IsUnique();

        modelBuilder.Entity<Plan>()
            .HasIndex(p => new { p.UserId, p.PeriodId })
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        base.OnModelCreating(modelBuilder);
    }
}
