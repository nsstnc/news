using backend;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddCors();

// ������ ����������� � ���� ������
string connection = "Server=(localdb)\\mssqllocaldb;Database=news_app;Trusted_Connection=True;";

// ��������� �������� Context � �������� ������� � ����������
builder.Services.AddDbContext<Context>(options => options.UseSqlServer(connection));


var app = builder.Build();

// ��������� CORS
app.UseCors(builder =>
builder.WithOrigins("http://localhost:3000").WithMethods("GET"));



// �������������� url, ����� � �������� �� ��������� ���������� ������
RewriteOptions rewriteOptions = new RewriteOptions()
.AddRewrite("add_record", "add_record.html", true);
app.UseRewriter(rewriteOptions);

app.UseStaticFiles();
app.UseDefaultFiles();
app.UseFileServer();




app.MapGet("/articles", (Context db) => db.Articles.ToList());


app.MapGet("/delete", async (Context db) => {
    foreach (var article in db.Articles.ToArray())
    {
        db.Articles.Remove(article);
        await db.SaveChangesAsync();
    }

});

app.MapGet("/delete_last", async (HttpContext context, Context db) => {

    var article = db.Articles.OrderByDescending(p => p.Id)
                       .FirstOrDefault();
    if (article != null && db.Articles.Contains(article)) db.Articles.Remove(article);
    await db.SaveChangesAsync();
});


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
        // ���� � ����� uploads
        string fullPath = $"{uploadPath}/{file.FileName}";

        // ��������� ���� � ����� uploads
        using (var fileStream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        image = file.FileName;
    }


    string tag = form["tag"];
    string title = form["title"];
    string subtitle = form["subtitle"];


    Article article = new Article() { Tag = tag, Title = title, Subtitle = subtitle, Url = image };

    await db.Articles.AddAsync(article);
    await db.SaveChangesAsync();


    context.Response.Redirect("/add_record");
});





app.Run();
