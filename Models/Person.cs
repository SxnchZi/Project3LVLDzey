using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace Project3LVLDzey.Models
{
    public class Person
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "ФИО")]
        public string FullName { get; set; }

        [Required]
        [Display(Name = "Дата рождения")]
        [DataType(DataType.Date)]
        public DateTime BirthDate { get; set; }

        [Display(Name = "Фотография")]
        public string PhotoPath { get; set; }

        // [NotMapped]
        // [Display(Name = "Фото")]
        // public IFormFile PhotoFile { get; set; }

        [Display(Name = "Дополнительная информация")]
        public string AdditionalInfo { get; set; }
    }
} 