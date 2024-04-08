use sqlx::PgPool;
use std::io::BufWriter;
use std::{env, fs::File};
use time::{format_description, PrimitiveDateTime};
use xml::writer::{EmitterConfig, XmlEvent};
use xml::EventWriter;

#[derive(Debug)]
struct PostMetadata {
    slug: String,
    updated_at: PrimitiveDateTime,
}

#[cfg(feature = "sitemap")]
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv()?;

    let pool = PgPool::connect(&env::var("DATABASE_URL")?).await?;
    let file = File::create("public/sitemap-index.xml")?;
    let file = BufWriter::new(file);
    let mut writer = EmitterConfig::new()
        .perform_indent(true)
        .create_writer(file);

    writer.write(
        XmlEvent::start_element("urlset")
            .attr("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
            .attr("xmlns:xhtml", "http://www.w3.org/1999/xhtml")
            .attr(
                "xmlns:image",
                "http://www.google.com/schemas/sitemap-image/1.1",
            )
            .attr(
                "xmlns:video",
                "http://www.google.com/schemas/sitemap-video/1.1",
            )
            .attr(
                "xmlns:news",
                "http://www.google.com/schemas/sitemap-news/0.9",
            ),
    )?;

    let app_url = env::var("APP_URL")?;

    // First, write all the blog entries
    sqlx::query_as!(
        PostMetadata,
        r#"
SELECT slug,
       updated_at
FROM posts
ORDER BY updated_at DESC
    "#
    )
    .fetch_all(&pool)
    .await?
    .into_iter()
    .try_for_each(|p| write_post_entry(p, &app_url, &mut writer))?;

    // Next, write the static pages
    write_static_page_entry(&app_url, &mut writer)?;
    write_static_page_entry(&format!("{}/now", app_url), &mut writer)?;
    write_static_page_entry(&format!("{}/blog", app_url), &mut writer)?;

    writer.write(XmlEvent::end_element())?;

    Ok(())
}

fn write_post_entry(
    post: PostMetadata,
    app_url: &str,
    writer: &mut EventWriter<BufWriter<File>>,
) -> anyhow::Result<()> {
    let format = format_description::parse("[year]-[month]-[day]T[hour]:[minute]:[second]Z")?;
    let parsed_date = post.updated_at.format(&format)?;
    let route = format!("{}/blog/{}", app_url, post.slug);

    writer.write(XmlEvent::start_element("url"))?;
    writer.write(XmlEvent::start_element("loc"))?;
    writer.write(XmlEvent::characters(&route))?;
    writer.write(XmlEvent::end_element())?;
    writer.write(XmlEvent::start_element("lastmod"))?;
    writer.write(XmlEvent::characters(&parsed_date))?;
    writer.write(XmlEvent::end_element())?;
    writer.write(XmlEvent::start_element("changefreq"))?;
    writer.write(XmlEvent::characters("yearly"))?;
    writer.write(XmlEvent::end_element())?;
    writer.write(XmlEvent::start_element("priority"))?;
    writer.write(XmlEvent::characters("0.5"))?;
    writer.write(XmlEvent::end_element())?;
    writer.write(XmlEvent::end_element())?;

    Ok(())
}

fn write_static_page_entry(
    route: &str,
    writer: &mut EventWriter<BufWriter<File>>,
) -> anyhow::Result<()> {
    write_entry(route, "weekly", "0.8", writer)?;
    Ok(())
}

fn write_entry(
    route: &str,
    change_frequency: &str,
    priority: &str,
    writer: &mut EventWriter<BufWriter<File>>,
) -> anyhow::Result<()> {
    writer.write(XmlEvent::start_element("url"))?;
    writer.write(XmlEvent::start_element("loc"))?;
    writer.write(XmlEvent::characters(route))?;
    writer.write(XmlEvent::end_element())?;
    writer.write(XmlEvent::start_element("changefreq"))?;
    writer.write(XmlEvent::characters(change_frequency))?;
    writer.write(XmlEvent::end_element())?;
    writer.write(XmlEvent::start_element("priority"))?;
    writer.write(XmlEvent::characters(priority))?;
    writer.write(XmlEvent::end_element())?;
    writer.write(XmlEvent::end_element())?;

    Ok(())
}
