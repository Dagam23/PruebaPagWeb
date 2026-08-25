import { Component, ErrorInfo, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
	state: ErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error("Application render error", error, info.componentStack);
	}

	render() {
		if (this.state.hasError) {
			return (
				<main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
					<h1>No se pudo cargar la pagina</h1>
					<p>Recarga la pagina. Si el problema continua, abre la consola del navegador.</p>
					{this.state.error?.message && <small>{this.state.error.message}</small>}
				</main>
			);
		}

		return this.props.children;
	}
}

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error('Missing root element with id "root"');
}

createRoot(rootElement).render(
	<ErrorBoundary>
		<App />
	</ErrorBoundary>,
);
