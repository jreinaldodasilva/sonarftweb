import React from "react";
import DoggyWelcome from "../../components/DoggyWelcome/DoggyWelcome";
import "./doggy.css";

const Doggy = () => {
    return (
        <section>
            <main className="doggy">
                    <div className="doggy-container">
                        <DoggyWelcome />
                    </div>
            </main>
        </section>
    );
};

export default Doggy;
