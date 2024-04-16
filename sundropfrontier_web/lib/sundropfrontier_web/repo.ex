defmodule SundropfrontierWeb.Repo do
  use Ecto.Repo,
    otp_app: :sundropfrontier_web,
    adapter: Ecto.Adapters.Postgres
end
