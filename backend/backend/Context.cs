﻿using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;

namespace backend
{
    public class Context : DbContext
    {
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
                    new Article { Id = 1, Url = "flags.jpg", Tag = "Главное", Title = "Заголовок", Subtitle = "Текст" },
                    new Article { Id = 2, Url = "flags.jpg", Tag = "Спорт", Title = "Заголовок", Subtitle = "Текст" },
                    new Article { Id = 3, Url = "flags.jpg", Tag = "Политика", Title = "Заголовок", Subtitle = "Текст" }
            );
        }

    }
}
