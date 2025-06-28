using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project3LVLDzey.Data;
using Project3LVLDzey.Models;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Project3LVLDzey.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly string _photosPath;

        public PersonController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            var webRoot = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            _photosPath = Path.Combine(webRoot, "photos");
            if (!Directory.Exists(_photosPath))
                Directory.CreateDirectory(_photosPath);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var people = await _context.People.ToListAsync();
            return Ok(people);
        }

        [HttpGet("today")]
        public async Task<IActionResult> GetToday()
        {
            var today = DateTime.Today;
            var people = await _context.People
                .Where(p => p.BirthDate.Month == today.Month && p.BirthDate.Day == today.Day)
                .ToListAsync();
            return Ok(people);
        }

        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcoming()
        {
            var today = DateTime.Today;
            var people = await _context.People
                .Where(p => (p.BirthDate.Month > today.Month) ||
                            (p.BirthDate.Month == today.Month && p.BirthDate.Day > today.Day))
                .OrderBy(p => p.BirthDate.Month).ThenBy(p => p.BirthDate.Day)
                .ToListAsync();
            return Ok(people);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var person = await _context.People.FindAsync(id);
            if (person == null) return NotFound();
            return Ok(person);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromForm] string fullName, [FromForm] DateTime birthDate, [FromForm] string additionalInfo, [FromForm] IFormFile photoFile)
        {
            var model = new Person
            {
                FullName = fullName,
                BirthDate = birthDate,
                AdditionalInfo = additionalInfo
            };

            if (photoFile != null)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(photoFile.FileName);
                var filePath = Path.Combine(_photosPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await photoFile.CopyToAsync(stream);
                }
                model.PhotoPath = $"photos/{fileName}";
            }
            _context.People.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] string fullName, [FromForm] DateTime birthDate, [FromForm] string additionalInfo, [FromForm] IFormFile photoFile)
        {
            var person = await _context.People.FindAsync(id);
            if (person == null) return NotFound();
            person.FullName = fullName;
            person.BirthDate = birthDate;
            person.AdditionalInfo = additionalInfo;
            if (photoFile != null)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(photoFile.FileName);
                var filePath = Path.Combine(_photosPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await photoFile.CopyToAsync(stream);
                }
                person.PhotoPath = $"photos/{fileName}";
            }
            await _context.SaveChangesAsync();
            return Ok(person);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var person = await _context.People.FindAsync(id);
            if (person == null) return NotFound();
            if (!string.IsNullOrEmpty(person.PhotoPath))
            {
                var filePath = Path.Combine(_photosPath, Path.GetFileName(person.PhotoPath));
                if (System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);
            }
            _context.People.Remove(person);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
} 