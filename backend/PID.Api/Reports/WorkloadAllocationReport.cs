using System.Text;
using DinkToPdf;
using DinkToPdf.Contracts;
using PID.Domain.Dtos;
using PID.Domain.Reports;

namespace PID.Api.Reports;

public class WorkloadAllocationReport : IReport<PlanDto>
{
    private IConverter _converter;

    private static readonly List<string> days = new List<string>
    {
        "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"
    };

    private static readonly Dictionary<string, string> times = new Dictionary<string, string>
    {
        { "M1", "07:40-08:30" }, { "M2", "08:30-09:20" }, { "M3", "09:20-10:10" }, { "M4", "10:30-11:20" }, { "M5", "11:20-12:10" },
        { "T1", "13:20-14:10" }, { "T2", "14:10-15:00" }, { "T3", "15:20-16:10" }, { "T4", "16:10-17:00" },
        { "N1", "19:00-19:50" }, { "N2", "19:50-20:40" }, { "N3", "20:50-21:40" }, { "N4", "21:40-22:30" }
    };

    public WorkloadAllocationReport(IConverter converter)
    {
        _converter = converter;
    }

    public byte[] GetPdf(PlanDto data)
    {
        var globalSettings = new GlobalSettings
        {
            ColorMode = ColorMode.Color,
            Orientation = Orientation.Landscape,
            PaperSize = new PechkinPaperSize("297", "210"),
            Margins = new MarginSettings
            {
                Bottom = 10,
                Left = 5,
                Right = 5,
                Top = 5,
                Unit = Unit.Millimeters
            }
        };

        var objectSettings = new ObjectSettings
        {
            HtmlContent = GetHtmlContent(data),
            WebSettings =
            {
                DefaultEncoding = "utf-8",
                UserStyleSheet = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "styles",
                    "WorkloadAllocationReport.css")
            },
            FooterSettings =
            {
                FontName = "Arial",
                FontSize = 9,
                Spacing = 5,
                Line = false,
                Center = ""
            }
        };

        var pdf = new HtmlToPdfDocument()
        {
            GlobalSettings = globalSettings,
            Objects = { objectSettings }
        };

        return _converter.Convert(pdf);
    }

    public static string GetHtmlContent(PlanDto data)
    {
        var template = new StringBuilder();

        template.Append(@$"
            <div class='template'>
                <div class='header'>
                    <img alt='logo' class='logo-img' src='{GetLogo()}' />
                    <ul class='header-info'>
                        <li class='header-info-item'>
                            Nome: {data.User?.Name}
                        </li>
                        <li class='header-info-item'>
                            Período: {data.Period} 
                        </li>
                    </ul>
                </div>");

        template.Append(@"
            <div class='schedule-container'>
                <table>
                    <thead>
                        <tr>
                            <th class='time-header'>Horário</th>
        ");

        foreach (var day in days)
            template.Append($"<th>{day}</th>");

        template.Append(@"
                        </tr>
                    </thead>
                    <tbody>
        ");

        for (int i = 0; i < times.Count; i++)
        {

            template.Append(@$"
                {(i == 4 || i == 8 ? "<tr class='period-separator'>" : "<tr>")}
                    <td class='time-column'>
                        <div class='upper-time'>{times.ElementAt(i).Key}</div>
                        <div class='lower-time'>{times.ElementAt(i).Value}</div>
                    </td>
            ");

            for (int j = 0; j < days.Count; j++)
                template.Append($"<td>{GetActivityDescription(i, j, data.Activities)}</td>");

            template.Append("</tr>");
        }

        template.Append(@"
                        </tbody>
                    </table>
                </div>
            </div>
        ");

        return template.ToString();
    }

    private static string GetLogo()
    {
        return Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot",
            "images",
            "IFFar.png"
        );
    }

    private static string GetActivityDescription(int i, int j, List<PlanActivityDto>? activities)
    {
        if (activities == null)
            return string.Empty;

        foreach (var activity in activities)
        {
            if (activity.WorkloadAllocation.Contains($"{i}/{j}"))
                return activity.Description;
        }

        return string.Empty;
    }
}
