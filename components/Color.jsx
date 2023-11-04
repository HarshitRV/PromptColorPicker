import styles from "./Color.module.scss";
import { useEffect, useState } from "react";

export default function Color({ color }) {
	const [copyVisible, setCopyVisible] = useState(false);

	const copyColor = () => {
		navigator.clipboard.writeText(color);
		setCopyVisible(true);
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setCopyVisible(false);
		}, 500);

		return () => clearInterval(interval);
	}, [copyVisible]);

	return (
		<div
			onClick={copyColor}
			className={`${styles.color}`}
			style={{ backgroundColor: `${color}` }}>
			<p className={styles.option}>{color}</p>
			{copyVisible && <p className={styles.copy}>Copied!</p>}
		</div>
	);
}
