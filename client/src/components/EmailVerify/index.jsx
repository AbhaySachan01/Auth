import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import success from "../../images/success.png";
import styles from "./styles.module.css";
import { Fragment } from "react";

const EmailVerify = () => {
	const [validUrl, setValidUrl] = useState(false); // Start as false to avoid flickering
	const [loading, setLoading] = useState(true); // Loading state
	const param = useParams();

	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				const url = `http://localhost:8080/api/user/${param.id}/verify/${param.token}`;
				await axios.get(url);
				setValidUrl(true);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false); // Stop loading after request completes
			}
		};
		verifyEmailUrl();
	}, [param]);

	if (loading) {
		return <h1>Verifying...</h1>; // Show verification message instead of flickering
	}

	return (
		<Fragment>
			{validUrl ? (
				<div className={styles.container}>
					<img src={success} alt="success_img" className={styles.success_img} />
					<h1>Email verified successfully</h1>
					<Link to="/login">
						<button className={styles.green_btn}>Login</button>
					</Link>
				</div>
			) : (
				<h1>404 Not Found</h1>
			)}
		</Fragment>
	);
};

export default EmailVerify;
