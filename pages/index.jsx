import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import Color from "@/components/Color";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
	const [inputText, setInputText] = useState("");
	const [canGenerate, setCanGenerate] = useState(false);
	const [placeHolderText, setPlaceHolderText] = useState(
		"Google theme color pallete"
	);
	const [colorPallete, setColorPallete] = useState([
		"#FF5B22",
		"#FF9130",
		"#FECDA6",
		"#A9A9A9",
	]);

	const inputChangeHandler = (event) => {
		const { value } = event.target;

		if (value.trim().length === 0) {
			setCanGenerate(false);
			setInputText("");
			return;
		}

		if(value.trim().length > 50) {
			setCanGenerate(false);
			toast.error("Only 50 characters allowed!");
			return;
		}

		setInputText(value);
		setCanGenerate(true);
	};

	useEffect(() => {
		const textArr = [
			"Tesla theme color pallete",
			"Star wars theme color pallete",
			"F.R.I.N.D.S apartment theme color pallete",
			"Harry potter theme color pallete",
			"2 year old birthday party theme color pallete",
		];

		const interval = setInterval(() => {
			setPlaceHolderText(textArr[Math.floor(Math.random() * textArr.length)]);
		}, 2000);

		return () => clearInterval(interval);
	});

	const getColorPallete = async () => {
		const response = await toast.promise(
			fetch("/api/pallete", {
				method: "POST",
				body: JSON.stringify({ input: inputText }),
			}),
			{
				pending: "Loading...",
				success: "Success!",
				error: "Error",
			}
		);

		const data = await response.json();
		setColorPallete(data.pallete);
	};

	return (
		<>
			<Head>
				<title>Color Pallete App</title>
				<meta
					name="description"
					content="Recommends the color pallete based on your description"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link
					rel="icon"
					href="/favicon.ico"
				/>
			</Head>
			<main className={styles.main}>
				<div className={styles.input}>
					<input
						type="text"
						onChange={inputChangeHandler}
						value={inputText}
						placeholder={placeHolderText}
					/>
					<button
						disabled={!canGenerate}
						onClick={getColorPallete}>
						Generate
					</button>
				</div>
				<div className={styles.pallete}>
					{colorPallete.map((color, index) => {
						return (
							<Color
								key={index}
								color={color}
							/>
						);
					})}
				</div>
				<div className={styles.toastContainer}></div>
			</main>
			<ToastContainer
				position="bottom-center"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				className={styles.customToastContainer}
			/>
		</>
	);
}
