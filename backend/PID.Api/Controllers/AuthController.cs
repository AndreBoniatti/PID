using Google.Apis.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using PID.Domain.Dtos;
using PID.Domain.Repositories;
using PID.Domain.Entities;
using PID.Api.Extensions;

namespace PID.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : MainController
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("Google")]
    public async Task<IActionResult> GoogleLogin(
        [FromBody] GoogleLoginDto dto,
        [FromServices] IUserRepository userRepository
    )
    {
        try
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken);

            var user = userRepository.Find(x => x.Email == payload.Email).FirstOrDefault();
            if (user == null)
            {
                user = new User(payload.Email, payload.Name);
                userRepository.Add(user);
            }
            else
            {
                user.Update(payload.Name);
                userRepository.Update(user);
            }

            await userRepository.SaveChangesAsync();

            var jwtToken = GenerateJwtToken(payload, user);

            return Ok(new { token = jwtToken });
        }
        catch
        {
            return Unauthorized();
        }
    }

    private string GenerateJwtToken(GoogleJsonWebSignature.Payload payload, User user)
    {
        var claims = new List<Claim>
        {
            new Claim("name", payload.Name),
            new Claim("email", payload.Email),
            new Claim("picture", payload.Picture),
            new Claim("type", ((int)user.Type).ToString()),
            new Claim("id", user.Id.ToString()),
        };

        var secretKey = _configuration["Jwt:Key"] ?? "";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}