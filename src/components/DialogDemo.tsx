import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DialogDemo() {
  return (
    <div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full max-w-lg mx-auto mt-8">
          {/* Content */}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-300 rounded-t">
              <h3 className="text-2xl font-semibold text-gray-800">
                Booking Detail
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none font-semibold outline-none focus:outline-none"
              >
                <span className="block h-6 w-6">×</span>
              </button>
            </div>
            {/* Body */}
            <form >
              <div className="p-6 flex flex-col space-y-4">
                <div className="space-y-2">
                  <div className="text-gray-700">
                    <strong>Vehicle:</strong> 
                  </div>
                  <div className="text-gray-600">
                    <strong>Specifications:</strong>{" "}
                  </div>
                  <div className="text-gray-600">
                    <strong>Price per Day:</strong> $
                  </div>
                  <div className="text-gray-600">
                    <strong>Start Date:</strong> 
                  </div>
                  <div className="text-gray-600">
                    <strong>End Date:</strong> 
                  </div>
                  <div className="text-gray-600">
                    <strong>Total Days:</strong>  days
                  </div>
                  <div className="text-gray-800 font-semibold">
                    <strong>Rental Rate:</strong> $
                  </div>
                </div>
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="text-gray-700 font-semibold mb-2">
                    Customer Details:
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label
                        htmlFor="customer_name"
                        className="text-sm font-medium text-gray-600"
                      >
                        Customer Name:
                      </label>
                      <input
                        type="text"
                        id="customer_name"
                        className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="phone_number"
                        className="text-sm font-medium text-gray-600"
                      >
                        Phone Number:
                      </label>
                      <input
                        type="text"
                        id="phone_number"
                        className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-600"
                      >
                        Email:
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-end p-4 border-t border-gray-300 rounded-b">
                <button
                  className="text-gray-500 hover:text-gray-700 font-bold text-sm px-4 py-2 rounded-md mr-2"
                  type="button"
                >
                  Close
                </button>
                <button
                  className="bg-emerald-500 text-white font-bold text-sm px-4 py-2 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  type="submit"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </div>
  );
}
