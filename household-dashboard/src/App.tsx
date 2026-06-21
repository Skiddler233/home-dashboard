import { Widget } from "./components/Widget";
import { TaskList } from "./features/tasks/TaskList";
import { WeatherWidget } from "./features/weather/WeatherWidget";
import { ServerWidget } from "./features/server/ServerWidget";

function App() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header__text">
          <p className="dashboard-eyebrow">Household Control</p>
          <h1>Dashboard</h1>
        </div>
        <div className="dashboard-status">
          <span className="status-dot" aria-hidden="true" />
          <span>Systems online</span>
        </div>
      </header>

      <div className="dashboard-grid">
        <Widget title="Tasks" icon="◫">
          <TaskList />
        </Widget>
        <Widget title="Weather" icon="◌">
          <WeatherWidget />
        </Widget>
        <Widget title="Server" icon="⎈">
          <ServerWidget />
        </Widget>
      </div>
    </div>
  );
}

export default App;
