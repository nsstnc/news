using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;

namespace backend
{
    public class Context : DbContext
    {
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Article> Articles { get; set; } = null!;
        public Context(DbContextOptions<Context> options)
            : base(options)
        {
            // создание базы данных
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Article>().HasData(
                    new Article { Id = 1, Url = "4.jpeg", Tag = "Главное", Title = "Заголовок", Subtitle = "Текст", Updated = DateTime.Now},
                    new Article { Id = 2, Url = "4.jpeg", Tag = "Спорт", Title = "Заголовок", Subtitle = "Текст", Updated = DateTime.Now },
                    new Article { Id = 3, Url = "4.jpeg", Tag = "Политика", Title = "Заголовок", Subtitle = "Текст", Updated = DateTime.Now }
            );
            modelBuilder.Entity<User>().HasData(
                        new User { Id = 1, Nickname = "admin", Password = PasswordHasher.HashPassword("admin") }

                );
        }

    }
}
