namespace PID.Domain.Entities;

public class Period : EntityBase
{
    public Period(int year, int semester)
    {
        Year = year;
        Semester = semester;
    }

    public int Year { get; private set; }
    public int Semester { get; private set; }

    public virtual ICollection<Plan>? Plans { get; private set; }

    public string GetInfo()
    {
        return $"{Year} / {Semester}";
    }
}