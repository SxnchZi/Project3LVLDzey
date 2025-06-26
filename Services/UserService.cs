using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Models;
using Data;

public class UserService
{
    private readonly AppDbContext _context;
    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User> RegisterAsync(string userName, string email, string password)
    {
        if (await _context.Users.AnyAsync(u => u.UserName == userName || u.Email == email))
            return null;
        var user = new User
        {
            UserName = userName,
            Email = email,
            PasswordHash = HashPassword(password),
            DateCreated = DateTime.Now
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User> AuthenticateAsync(string userName, string password)
    {
        var hash = HashPassword(password);
        return await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName && u.PasswordHash == hash);
    }

    private string HashPassword(string password)
    {
        using (var sha = SHA256.Create())
        {
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
} 