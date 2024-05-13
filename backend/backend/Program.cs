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

var builder = WebApplication.CreateBuilder(args);
Role admin = new Role("admin");

builder.Services.AddCors();

// ������ ����������� � ���� ������
string connection = "Server=(localdb)\\mssqllocaldb;Database=news_app1;Trusted_Connection=True;";

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



// �������������� url, ����� � �������� �� ��������� ���������� ������
RewriteOptions rewriteOptions = new RewriteOptions()
.AddRewrite("add_record", "add_record.html", true);
app.UseRewriter(rewriteOptions);

app.UseStaticFiles();
app.UseDefaultFiles();
app.UseFileServer();




app.MapGet("/articles", (Context db) => db.Articles.ToList());



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


    Article article = new Article() { Tag = tag, Title = title, Subtitle = subtitle, Url = image };

    await db.Articles.AddAsync(article);
    await db.SaveChangesAsync();

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
        User? user = db.Users.FirstOrDefault(p => p.Nickname == model.Nickname && p.Password == model.Password);
        // ���� ������������ �� ������, ���������� ��������� ��� 401
        if (user is null) return Results.Unauthorized();
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
    return Results.Ok();
});


app.Map("/admin", [Authorize] (HttpContext context, Context db) =>
{
    List<Article> articles = db.Articles.ToList();
    List<User> users = db.Users.ToList();

    var data = new
    {
        Articles = articles,
        Users = users
    };

    return data;
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

app.MapDelete("/delete_article_by_id", async (HttpContext context, Context db) =>
{
    
});

app.Run();


// ������ ��� �������� �������������
record class Model(string Nickname, string Password);

record class Role(string Name);

record class Item(int Id);