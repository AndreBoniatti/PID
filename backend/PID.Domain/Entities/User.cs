using PID.Domain.Enums;

namespace PID.Domain.Entities;

public class User : EntityBase
{
    public User(string email, string name, string picure)
    {
        Email = email;
        Name = name;
        Picure = picure;

        Type = EUserType.TEACHER;
        Workload = 40;
    }

    public string Email { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public string Picure { get; private set; } = string.Empty;
    public EUserType Type { get; private set; }
    public int Workload { get; private set; }

    public virtual ICollection<Plan>? Plans { get; private set; }

    public void Update(string name, string picure)
    {
        Name = name;
        Picure = picure;
        UpdatedAt = DateTime.UtcNow;
    }
}