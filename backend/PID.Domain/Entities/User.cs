using PID.Domain.Enums;

namespace PID.Domain.Entities;

public class User : EntityBase
{
    public User(string email, string name)
    {
        Email = email;
        Name = name;

        Type = EUserType.TEACHER;
        Workload = 40;
    }

    public string Email { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public EUserType Type { get; private set; }
    public int Workload { get; private set; }

    public virtual ICollection<Plan>? Plans { get; private set; }

    public void Update(string name)
    {
        Name = name;
        UpdatedAt = DateTime.UtcNow;
    }
}