import { Component } from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  error: null | Error;
};

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <p>
          <code>{error.message}</code>
        </p>
      );
    }

    return this.props.children;
  }
}
