namespace PID.Domain.Reports;

public interface IReport<T>
{
    byte[] GetPdf(T data);
}