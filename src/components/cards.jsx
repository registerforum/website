import styles from "@/styles/Cards.module.css";


export function LeftImageSmallCard(info) {
  return (
    <a href={`/writing/${info.slug}`}>
      {info.cover && (
        <div className={styles.leftcard}>
          <img src={info.cover} alt="Cover Photo" />
          <div className={styles.text}>
            <h2>
              {info.authors?.map((author, index) => (
                <span key={index}>
                  {author.name}
                  {index < info.authors.length - 1 ? ", " : ""}
                </span>
              ))}
            </h2>
            <h1>{info.title}</h1>
            <p>{info.body?.slice(0, 100)}...</p>
          </div>
        </div>
      )}
    </a>
  );
}

export function TopImageSmallCard(info) {
  return (
    <a href={`/writing/${info.slug}`}>
      {info.cover && (
        <div className={styles.topcard}>
          <img src={info.cover} alt="Cover Photo" />
          <div className={styles.text}>
            <h1>{info.title}</h1>
            <h2>
              {info.authors?.map((author, index) => (
                <span key={index}>
                  {author.name}
                  {index < info.authors.length - 1 ? ", " : ""}
                </span>
              ))}
            </h2>
            <p>{info.body?.slice(0, 100)}...</p>
          </div>
        </div>
      )}
    </a>
  );
}

export function ListCard(info) {
  return (
    <a href={`/writing/${info.slug}`}>
      <div className={styles.listcard}>
        <img src={info.cover || undefined} alt="Cover Photo" />
        <div className={styles.text}>
          <h1>{info.title}</h1>
          <div className={styles.meta}>
            <div>
              {info.authors && info.authors.length > 1 ? (
                <span>
                  {info.authors.map((author, index) => (
                    <>
                      {author.name}
                      {index < info.authors.length - 1 ? ", " : ""}
                    </>
                  ))}
                </span>
              ) : (
                info.authors[0] && (
                  <span>
                    {info.authors[0].name},{" "}
                    {info.authors[0].position?.trim() || "Contributing Writer"}
                  </span>
                )
              )}
            </div>
            <div className={styles.metadata}>
              <p>{info.date}</p>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
