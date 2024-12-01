using Google.Apis.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using PID.Domain.Dtos;
using PID.Domain.Repositories;
using PID.Domain.Entities;

namespace PID.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("google")]
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
                user = new User(payload.Name, payload.Email, payload.Picture);

                userRepository.Add(user);
                await userRepository.SaveChangesAsync();
            }

            var jwtToken = GenerateJwtToken(payload);

            return Ok(new { token = jwtToken });
        }
        catch (InvalidJwtException)
        {
            return Unauthorized();
        }
    }

    private string GenerateJwtToken(GoogleJsonWebSignature.Payload payload)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, payload.Subject),
            new Claim(ClaimTypes.Name, payload.Name),
            new Claim(ClaimTypes.Email, payload.Email)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("sua-chave-secreta-que-deve-ser-trocada-para-ser-mais-segura"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}