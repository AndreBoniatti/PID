namespace PID.Domain.Entities;

public class User : EntityBase
{
    public User(string name, string email, string picure)
    {
        Name = name;
        Email = email;
        Picure = picure;
    }

    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Picure { get; private set; } = string.Empty;
}