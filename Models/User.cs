using System;
using System.ComponentModel.DataAnnotations;

public class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    [Display(Name = "Имя пользователя")]
    public string UserName { get; set; }

    [Required]
    [Display(Name = "Хэш пароля")]
    public string PasswordHash { get; set; }

    [Required]
    [EmailAddress]
    [Display(Name = "Email")]
    public string Email { get; set; }

    [Display(Name = "Дата регистрации")]
    public DateTime DateCreated { get; set; } = DateTime.Now;
} 