namespace PID.Domain.Entities;

public class Period : EntityBase
{
    public int Year { get; private set; }
    public int Semester { get; private set; }

    public string GetInfo()
    {
        return $"{Year} / {Semester}";
    }
}