namespace PID.Domain.Dtos;

public class PagedList<T> where T : class
{
    public required IEnumerable<T> Data { get; set; }
    public int TotalCount { get; set; }
}