from app.db.session import init_db


def run() -> None:
    """Entry-point to initialize the database from CLI scripts."""
    init_db()


if __name__ == "__main__":
    run()

