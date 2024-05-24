using backend;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Claims;
using Newtonsoft.Json;
using System.Collections.Immutable;
using System.Security.Cryptography;
using Microsoft.Extensions.FileProviders;
using static System.Net.Mime.MediaTypeNames;
using Microsoft.AspNetCore.Http.HttpResults;

var builder = WebApplication.CreateBuilder(args);
Role admin = new Role("admin");

builder.Services.AddCors();

// ������ ����������� � ���� ������
string connection = "Server=(localdb)\\mssqllocaldb;Database=news_app;Trusted_Connection=True;";

// ��������� �������� Context � �������� ������� � ����������
builder.Services.AddDbContext<Context>(options => options.UseSqlServer(connection));


// ���������� �������������� � ������� ����
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options => {
        options.LoginPath = "/login";
    });
builder.Services.AddAuthorization();

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.Cookie.Name = "MySessionCookie";
    options.IdleTimeout = TimeSpan.FromMinutes(30); // ����� ����� ������
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();


// ������������� �������������� � ���������� 
app.UseAuthentication();
// ������������� ����������� � ����������
app.UseAuthorization();

// ��������� CORS
app.UseCors(builder =>
builder.WithOrigins("https://localhost:3000") // ��������� ������� ������ � ����� origin
                       .AllowAnyMethod()
                       .AllowAnyHeader()
                       .AllowCredentials());




// ��������� ������������� ����������� ������
app.UseStaticFiles();

app.UseDefaultFiles();
app.UseFileServer();




app.MapGet("/articles", (Context db) => db.Articles.OrderByDescending(a => a.Updated).ToList());



app.MapPost("/upload", async (HttpContext context, Context db) =>
{
    var form = context.Request.Form;
    IFormFileCollection files = context.Request.Form.Files;
    // ���� � �����, ��� ����� ��������� �����
    var uploadPath = $"{Directory.GetCurrentDirectory()}/wwwroot/images";
    // ������� ����� ��� �������� ������
    Directory.CreateDirectory(uploadPath);


    string image = "";

    foreach (var file in files)
    {
        // ���������� ���������� ��� �����
        string uniqueFileName = $"{Guid.NewGuid().ToString()}_{file.FileName}";

        // ���� � ����� uploads
        string fullPath = Path.Combine(uploadPath, uniqueFileName);

        // ��������� ���� � ����� 
        using (var fileStream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }
        image = uniqueFileName;
    }


    string tag = form["tag"];
    string title = form["title"];
    string subtitle = form["subtitle"];


    Article article = new Article() { Tag = tag, Title = title, Subtitle = subtitle, Url = image, Updated = DateTime.Now };

    await db.Articles.AddAsync(article);
    await db.SaveChangesAsync();

    return Results.Ok(article);
});







app.Map("/login", async (HttpContext context, Context db) =>
{
    // ������ ������ �� ���� �������
    using (StreamReader reader = new StreamReader(context.Request.Body))
    {
        string requestBody = await reader.ReadToEndAsync();

        app.Logger.LogInformation($"{requestBody}");

        // �������������� JSON-������ � ������ LoginModel
        Model model = JsonConvert.DeserializeObject<Model>(requestBody);



        // ����� ������������
        User? user = db.Users.FirstOrDefault(p => p.Nickname == model.Nickname);
        // ���� ������������ �� ������, ���������� ��������� ��� 401
        if (user is null) return Results.Unauthorized();

        // �������� ������������� ������
        if (!PasswordHasher.VerifyPassword(model.Password, user.Password)) return Results.Unauthorized();



        app.Logger.LogCritical($"{requestBody}");

        // ������ claim'��
        var claims = new List<Claim> {
            new Claim(ClaimTypes.Name, user.Nickname),
        };

        // ������ ClaimsIdentity
        ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, "Cookies");

        // ��������� ������������������ ���
        await context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

        return Results.Ok();
    }


});


app.MapGet("/logout", async (HttpContext context) =>
{
    await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.Ok();
});






app.Map("/check_auth", [Authorize] (HttpContext context, Context db) =>
{
    // �������� ��� ������������ �� Claims
    string userName = context.User.FindFirst(ClaimTypes.Name)?.Value;

    // ����� �������� ������������
    User? current_user = db.Users.FirstOrDefault(p => p.Nickname == userName);

    if (current_user == null) return Results.Unauthorized();
    return Results.Ok(userName);
});


app.Map("/admin", [Authorize] (HttpContext context, Context db) =>
{
    List<Article> articles = db.Articles.OrderByDescending(a => a.Updated).ToList();
    List<User> users = db.Users.ToList();

    var data = new
    {
        Articles = articles,
        Users = users
    };

    return data;
});

app.Map("/admin/users", [Authorize] (HttpContext context, Context db) =>
{
    return db.Users.ToList();
});

app.Map("/get_article_by_id", async (HttpContext context, Context db) =>
{
    // ������ ������ �� ���� �������
    using (StreamReader reader = new StreamReader(context.Request.Body))
    {
        string requestBody = await reader.ReadToEndAsync();

        app.Logger.LogCritical($"{requestBody}");

        Item item = JsonConvert.DeserializeObject<Item>(requestBody);


        Article article = db.Articles.Find(item.Id);


        var data = new
        {
            Article = article,
        };

        return data;
    }
});


app.Map("/get_user_by_id", async (HttpContext context, Context db) =>
{
    // ������ ������ �� ���� �������
    using (StreamReader reader = new StreamReader(context.Request.Body))
    {
        string requestBody = await reader.ReadToEndAsync();

        app.Logger.LogCritical($"{requestBody}");

        Item item = JsonConvert.DeserializeObject<Item>(requestBody);


        User user = db.Users.Find(item.Id);


        var data = new
        {
            User = user,
        };

        return data;
    }
});


app.MapDelete("/delete_article_by_id", async (HttpContext context, Context db) =>
{
    // ������ ������ �� ���� �������
    using (StreamReader reader = new StreamReader(context.Request.Body))
    {
        string requestBody = await reader.ReadToEndAsync();

        app.Logger.LogCritical($"{requestBody}");


        int id = int.Parse(requestBody);

        var article = await db.Articles.FirstOrDefaultAsync(a => a.Id == id);
        var filename = article?.Url;

        // ������� ������ �����������
        var path = $"{Directory.GetCurrentDirectory()}/wwwroot/images";
        string fullPath = Path.Combine(path, filename);
        try
        {
            File.Delete(fullPath);
        }
        catch (UnauthorizedAccessException ex)
        {
            app.Logger.LogCritical($"�� ������� ������� ����. {ex}");
        }

        // �������� �� �� �� id
        await db.Articles.Where(a => a.Id == id).ExecuteDeleteAsync();


        await db.SaveChangesAsync();
    }
});


app.MapPut("/edit_article_by_id", async (HttpContext context, Context db) =>
{
    var form = context.Request.Form;
    int id = int.Parse(form["id"]);
    string tag = form["tag"];
    string title = form["title"];
    string subtitle = form["subtitle"];



    Article? old = await db.Articles.FirstOrDefaultAsync(a => a.Id == id);




    IFormFileCollection files = context.Request.Form.Files;
    // ���� � �����, ��� ����� ��������� �����
    var uploadPath = $"{Directory.GetCurrentDirectory()}/wwwroot/images";
    // ������� ����� ��� �������� ������
    Directory.CreateDirectory(uploadPath);

    string image = "";

    foreach (var file in files)
    {
        // ���������� ���������� ��� �����
        string uniqueFileName = $"{Guid.NewGuid().ToString()}_{file.FileName}";

        // ���� � ����� uploads
        string fullPath = Path.Combine(uploadPath, uniqueFileName);

        // ��������� ���� � ����� 
        using (var fileStream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }
        image = uniqueFileName;
    }



    old.Title = title;
    old.Subtitle = subtitle;
    old.Tag = tag;
    old.Updated = DateTime.Now;

    // ���� ����� ����������� ���� ���������
    if (image != "")
    {
        // ������� ������ �����������
        var path = $"{Directory.GetCurrentDirectory()}/wwwroot/images";
        string fullPath = Path.Combine(path, old.Url);

        File.Delete(fullPath);

        old.Url = image;
    }


    await db.SaveChangesAsync();

    return Results.Ok(old);
});


app.MapPut("/edit_user_by_id", async (HttpContext context, Context db) =>
{
    var form = context.Request.Form;
    int id = int.Parse(form["id"]);
    string nickname = form["nickname"];
    string old_password = form["old_password"];
    string password = form["password"];

    User? old = await db.Users.FirstOrDefaultAsync(a => a.Id == id);

    if (PasswordHasher.VerifyPassword(old_password, old.Password))
    {
        old.Nickname = nickname;
        old.Password = PasswordHasher.HashPassword(password);

        await db.SaveChangesAsync();
        return Results.Ok(old);
    }
    else
    {
        return Results.Unauthorized();
    }

    
});

app.MapPost("/add_user", async (HttpContext context, Context db) =>
{
    var form = context.Request.Form;

    // �������� ��� ������������ �� Claims
    string userName = context.User.FindFirst(ClaimTypes.Name)?.Value;

    // ����� �������� ������������
    User? current_user = db.Users.FirstOrDefault(p => p.Nickname == userName);

    string nickname = form["nickname"];
    string current_password = form["current_password"];
    string password = PasswordHasher.HashPassword(form["password"]);

    // ��������� ���������� ������ �������� ������������
    if (PasswordHasher.VerifyPassword(current_password, current_user.Password))
    {
        User user = new User() { Nickname = nickname, Password = password };

        await db.Users.AddAsync(user);
        await db.SaveChangesAsync();
        return Results.Ok(user);
    }
    else
    {
        return Results.Unauthorized();
    }
});


app.MapPost("/delete_user_by_id", async (HttpContext context, Context db) =>
{
    var form = context.Request.Form;


    int id = int.Parse(form["id"]);
    string password = form["password"];

    // �������� ������������ �� id
    User? user = db.Users.FirstOrDefault(u => u.Id == id);

    // ��������� ���������� ������ �������� ������������
    if (PasswordHasher.VerifyPassword(password, user.Password))
    {

        // �������� �� �� �� id
        await db.Users.Where(u => u.Id == id).ExecuteDeleteAsync();
        await db.SaveChangesAsync();
        return Results.Ok();
    }
    else
    {
        return Results.Unauthorized();
    }
});



app.Run();


// ������ ��� �������� �������������
record class Model(string Nickname, string Password);

record class Role(string Name);

record class Item(int Id);