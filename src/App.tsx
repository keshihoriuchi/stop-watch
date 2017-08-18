import * as React from "react";
import "./App.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import moment = require("moment");
require("moment-duration-format");

interface State {
  elapsed: number;
  isRunning: boolean;
}

class StopWatch {
  private isRunning: boolean;
  private lastStarted: Date;
  private lastElapsed: number;
  private cb: (elapsed: number) => void;
  private intervalID: number;
  constructor(cb: (e: number) => void) {
    this.isRunning = false;
    this.lastElapsed = 0;
    this.cb = cb;
  }
  start() {
    this.isRunning = true;
    this.lastStarted = new Date();

    this.intervalID = window.setInterval(() => {
      this.cb(this._elapsed());
    }, 100);
  }
  stop() {
    this.isRunning = false;
    this.lastElapsed = this._elapsed();
    this.cb(this.lastElapsed);
    window.clearInterval(this.intervalID);
  }

  _elapsed() {
    return new Date().getTime() - this.lastStarted.getTime() + this.lastElapsed;
  }
}

class App extends React.Component<{}, State> {
  private clock: StopWatch;

  constructor(props: {}) {
    super(props);

    this.startClock = this.startClock.bind(this);
    this.stopClock = this.stopClock.bind(this);
    this.resetClock = this.resetClock.bind(this);

    this.state = { elapsed: 0, isRunning: false };
    this.clock = new StopWatch(e => {
      this.setState({ elapsed: e });
    });
  }

  componentWillUnmount() {
    this.clock.stop();
  }

  startClock() {
    this.clock.start();
    this.setState({ isRunning: true });
  }

  stopClock() {
    this.clock.stop();
    this.setState({ isRunning: false });
  }

  resetClock() {
    if (this.state.isRunning) {
      this.clock.stop();
    }
    this.clock = new StopWatch(e => {
      this.setState({ elapsed: e });
    });
    this.setState({
      elapsed: 0,
      isRunning: false
    });
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="stopwatch">
          <div className="display">
            {moment
              .duration(this.state.elapsed, "ms")
              .format("hh:mm:ss", { trim: false })}
          </div>
          <div className="controller">
            <RaisedButton
              onClick={this.state.isRunning ? this.stopClock : this.startClock}
              label={this.state.isRunning ? "停止" : "開始"}
            />
            <RaisedButton label="リセット" onClick={this.resetClock} />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
