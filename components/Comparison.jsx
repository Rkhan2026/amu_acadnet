"use client";
import React from "react";
import { Check, X } from "lucide-react";

const Comparison = () => {
  return (
    <section id="why-us" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Why AMU AcadNet?
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            See how we differ from public platforms and traditional management
            systems.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-3xl shadow-lg border-hidden overflow-hidden">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="py-6 px-6 text-left text-lg font-bold">
                  Feature
                </th>
                <th className="py-6 px-6 text-center text-lg font-bold bg-amu-green">
                  AMU AcadNet
                </th>
                <th className="py-6 px-6 text-center text-lg font-medium text-gray-300">
                  Public Platforms <br />
                  <span className="text-xs font-normal">
                    (e.g., ResearchGate)
                  </span>
                </th>
                <th className="py-6 px-6 text-center text-lg font-medium text-gray-300">
                  IMS Systems <br />
                  <span className="text-xs font-normal">(e.g., Pure)</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["Institutional Verification", true, false, true],
                ["Internal Collaboration Focus", true, false, false],
                ["AI-Based Recommendations", true, true, false],
                ["Official Record Management", true, false, true],
                ["Interdisciplinary Discovery", true, true, false],
                ["Controlled Access (RBAC)", true, false, true],
              ].map(([feature, acadNet, publicPlatform, ims], idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-5 px-6 font-medium text-gray-900">
                    {feature}
                  </td>
                  <td className="py-5 px-6 text-center bg-amu-green/10">
                    {acadNet ? (
                      <Check className="h-6 w-6 text-amu-green mx-auto" />
                    ) : (
                      <X className="h-6 w-6 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-5 px-6 text-center">
                    {publicPlatform ? (
                      <Check className="h-6 w-6 text-gray-400 mx-auto" />
                    ) : (
                      <X className="h-6 w-6 text-red-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-5 px-6 text-center">
                    {ims ? (
                      <Check className="h-6 w-6 text-gray-400 mx-auto" />
                    ) : (
                      <X className="h-6 w-6 text-red-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
